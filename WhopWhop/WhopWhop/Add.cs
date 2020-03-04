

using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace WhopWhop
{
    public class Add
    {
        private readonly IConfiguration _configuration;
        private const string _tableName = "Whop";

        public Add(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [FunctionName("add")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
            HttpRequest req, ILogger log, ClaimsPrincipal principal)
        {
            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject<WhopRequest>(requestBody);
            if (data == null)
                return new BadRequestObjectResult("Please pass a name on the query string or in the request body");

            var entity = new WhopEntity(data.UserId, data.Name);
            entity.Body = data.Body;
            CloudTable table = TableReference();

            await table.CreateIfNotExistsAsync();

            var op = TableOperation.InsertOrMerge(entity);
            var result = await table.ExecuteAsync(op);
            var insertedWhop = result.Result as WhopEntity;

            return new OkObjectResult(data);
        }

        private CloudTable TableReference()
        {
            string storageConnectionString = _configuration["storageConnectionString"];

            var storageAccount = CloudStorageAccount.Parse(storageConnectionString);

            var tableClient = storageAccount.CreateCloudTableClient(new TableClientConfiguration());

            var table = tableClient.GetTableReference(_tableName);
            return table;
        }

        [FunctionName("getall")]
        public  async Task<IActionResult> GetAll([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req, ILogger log, ClaimsPrincipal principal)
        {
            var table = TableReference();
            var result = table.ExecuteQuery(new TableQuery<WhopEntity>()).GetEnumerator();

            TableContinuationToken token = null;
            var entities = new List<WhopEntity>();
            do
            {
                var queryResult = table.ExecuteQuerySegmented(new TableQuery<WhopEntity>(), token);
                entities.AddRange(queryResult.Results);
                token = queryResult.ContinuationToken;
            } while (token != null);
            return new OkObjectResult(entities);
        }

    }

    public class WhopEntity : TableEntity
    {
        public WhopEntity() { }
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