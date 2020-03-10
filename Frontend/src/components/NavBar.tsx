import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Grid, Divider } from "@material-ui/core";
import { IUser, IWhoop } from "models/whoop";
import api from "utils/api-client";
import { v4 } from "uuid";
import AddIcon from "@material-ui/icons/Add";
import _ from "lodash";
import whop_transparent from "../img/whop_transparent.png";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuButton: {
            marginRight: theme.spacing(2)
        },
        title: {
            flexGrow: 1
        }
    })
);

const NavBar: React.FC = () => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [options, setOptions] = React.useState<IUser[]>([]);
    const [selectedUser, setSelectedUser] = React.useState<IUser>({ name: "", userPrincipalName: "" });
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [lastSearchTerm, setLastSearchTerm] = useState<string>("");
    const [body, setBody] = useState<string>("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleSave = () => {
        setOpen(false);
        const whop: IWhoop = {
            body,
            userId: v4(),
            name: selectedUser.name,
            uNumber: selectedUser.userPrincipalName
        };
        api.Whoops.create(whop).then(() => {
            setBody("");
            setSelectedUser({ name: "", userPrincipalName: "" });
        });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    function setOptionLabel(option: IUser): string {
        if (option != null) {
            setSelectedUser(option);
        }
        return typeof option === "string" ? option : option.name;
    }

    useEffect(() => {
        if (inputValue === lastSearchTerm || isSearching) {
            setLastSearchTerm(inputValue);
            return;
        }

        if (inputValue.length > 3) {
            setIsSearching(true);

            api.Whoops.search(inputValue).then(response => {
                const noAdmin = _.filter(response, r => !r.userPrincipalName.toLowerCase().startsWith("adm"));
                setOptions(noAdmin);
                setIsSearching(false);
                setLastSearchTerm(inputValue);
            });
        }
    }, [inputValue, isSearching, lastSearchTerm]);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    <img src={whop_transparent} style={{ height: "50px" }} />
                </Typography>
                <Button color="inherit" onClick={handleClickOpen}>
                    <AddIcon /> Create
                </Button>
            </Toolbar>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create Whoop</DialogTitle>
                <DialogContent>
                    <DialogContentText>Give a whoop to your friend.</DialogContentText>
                    <Autocomplete
                        id="google-map-demo"
                        style={{ width: 300 }}
                        getOptionLabel={(option: IUser) => setOptionLabel(option)}
                        filterOptions={(x: any) => x}
                        options={options}
                        autoComplete
                        includeInputInList
                        disableOpenOnFocus
                        renderInput={(params: any) => (
                            <TextField {...params} label="Add an employee" variant="outlined" fullWidth onChange={handleChange} />
                        )}
                        renderOption={(option: IUser) => {
                            return (
                                <Grid container alignItems="center">
                                    <Grid item xs>
                                        <span key={option.userPrincipalName}>{option.name}</span>
                                        <Typography variant="body2" color="textSecondary">
                                            {option.userPrincipalName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            );
                        }}
                    />
                    <Divider />
                    <TextField
                        label="Whop an employee"
                        variant="standard"
                        fullWidth
                        multiline
                        rows="3"
                        id="whop"
                        onChange={e => setBody(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </AppBar>
    );
};

export default NavBar;
