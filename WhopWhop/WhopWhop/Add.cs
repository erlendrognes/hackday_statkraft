

using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace WhopWhop
{
    public static class Add
    {
        [FunctionName("add")]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
            HttpRequest req, ILogger log, ClaimsPrincipal principal)
        {
            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);

            if (data == null)
                return new BadRequestObjectResult("Please pass a name on the query string or in the request body");

            var entity = new WhopEntity(data.UserId, data.Name);
            entity.Body = data.Body;

            const string storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=whopwhopstorage;AccountKey=qOnJtBPLDP90KFzOzo44ycw0HJUD+hBy19+k/0eMs+q76oUGtnvz7lGku3h/G6Fi8J4/DTyaw4HAZIQhDA6+NA==;EndpointSuffix=core.windows.net";
            var storageAccount = CloudStorageAccount.Parse(storageConnectionString);
            var tableClient = storageAccount.CreateCloudTableClient(new TableClientConfiguration());
            var table = tableClient.GetTableReference("Whop");
            await table.CreateIfNotExistsAsync();

            var op = TableOperation.InsertOrMerge(entity);
            var result = await table.ExecuteAsync(op);
            var insertedWhop = result.Result as WhopEntity;

            return new OkObjectResult(data);
        }
    }

    public class WhopEntity : TableEntity
    {
        public WhopEntity(string id, string name)
        {
            PartitionKey = name;
            RowKey = id;
        }
        public string Body { get; set; }
    }

    public class WhopRequest
    {
        public string Name { get; set; }
        public string Body { get; set; }
        public string UserId { get; set; }
    }
}