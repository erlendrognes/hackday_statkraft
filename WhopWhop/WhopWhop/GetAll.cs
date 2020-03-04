using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace WhopWhop
{
    public class GetAll
    {
        [FunctionName("getall")]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] ILogger log, ClaimsPrincipal principal)
        {
            const string storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=whopwhopstorage;AccountKey=qOnJtBPLDP90KFzOzo44ycw0HJUD+hBy19+k/0eMs+q76oUGtnvz7lGku3h/G6Fi8J4/DTyaw4HAZIQhDA6+NA==;EndpointSuffix=core.windows.net";
            var storageAccount = CloudStorageAccount.Parse(storageConnectionString);
            var tableClient = storageAccount.CreateCloudTableClient(new TableClientConfiguration());
            var table = tableClient.GetTableReference("Whop");
            await table.CreateIfNotExistsAsync();
             var result = table.ExecuteQuery(new TableQuery()).ToList();

            return new OkObjectResult(result);
        }
    }
}