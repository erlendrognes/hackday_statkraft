import React, {useState, useEffect} from 'react'
import AppBar from '@material-ui/core/AppBar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { IUser } from 'models/whoop';
import api from 'utils/api-client';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);



const NavBar: React.FC = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<IUser[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [lastSearchTerm, setLastSearchTerm] = useState<string>("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSave = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    if(inputValue === lastSearchTerm || isSearching) {
        setLastSearchTerm(inputValue);
        return;
    }

    if (inputValue.length > 3) {
      setIsSearching(true);

      api.Whoops.search(inputValue)
      .then(response => {
        console.log(response);
        setOptions(response);
        setIsSearching(false);
        setLastSearchTerm(inputValue);
      })
    }
  }, [inputValue, isSearching, lastSearchTerm]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          WhoopWhoop
        </Typography>
        <Button color="inherit" onClick={handleClickOpen}>Create</Button>
        <Button color="inherit">Login</Button>
      </Toolbar>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Whoop</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Give a whoop to your friend.
          </DialogContentText>
          <Autocomplete
      id="google-map-demo"
      style={{ width: 300 }}
      getOptionLabel={(option: IUser) => (typeof option === 'string' ? option : option.name)}
      filterOptions={(x: any) => x}
      options={options}
      autoComplete
      includeInputInList
      disableOpenOnFocus
      renderInput={(params: any) => (
        <TextField
          {...params}
          label="Add an employee"
          variant="outlined"
          fullWidth
          onChange={handleChange}
        />
      )}
      renderOption={(option: IUser) => {
        return (
          <Grid container alignItems="center">
            <Grid item xs>
              {options.map((option) => (
                <span key={option.userPrincipalName}>
                  {option.name}
                </span>
              ))}
              <Typography variant="body2" color="textSecondary">
                {option.userPrincipalName}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
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
  )
}

export default NavBar;
