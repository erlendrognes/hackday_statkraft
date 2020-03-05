

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
    public class Whop
    {
        private readonly IConfiguration _configuration;
        private const string _tableName = "Whop";

        public Whop(IConfiguration configuration)
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

            var entity = new WhopEntity(data.UserId, data.UNumber);
            entity.Body = data.Body;
            entity.Name = data.Name;
            CloudTable table = TableReference();

            await table.CreateIfNotExistsAsync();

            var op = TableOperation.InsertOrMerge(entity);
            var result = await table.ExecuteAsync(op);
            var insertedWhop = result.Result as WhopEntity;

            return new OkObjectResult(data);
        }


        [FunctionName("getall")]
        public async Task<IActionResult> GetAll([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req, ILogger log, ClaimsPrincipal principal)
        {
            var table = TableReference();

            TableContinuationToken token = null;
            var entities = new List<WhopEntity>();
            do
            {
                var queryResult = table.ExecuteQuerySegmented(new TableQuery<WhopEntity>(), token);

                entities.AddRange(queryResult.Results);
                token = queryResult.ContinuationToken;
            } while (token != null);
            var result = entities.Select(x => x.Map()).ToList();
            return new OkObjectResult(result);
        }

        [FunctionName("getallforuser")]
        public async Task<IActionResult> GetWhopsForUser([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req, ILogger log, ClaimsPrincipal principal)
        {
            string name = req.Query["name"];
            if (string.IsNullOrWhiteSpace(name))
                return new BadRequestObjectResult("Name cannot be null");

            var table = TableReference();
            TableContinuationToken token = null;
            var entities = new List<WhopEntity>();
            do
            {
                var query = new TableQuery<WhopEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, name));
                var queryResult = table.ExecuteQuerySegmented(query, token);

                entities.AddRange(queryResult.Results);
                token = queryResult.ContinuationToken;
            } while (token != null);
            var result = entities.Select(x => x.Map()).ToList();// Map();
            return new OkObjectResult(result);
        }

        private CloudTable TableReference()
        {
            string storageConnectionString =
                "DefaultEndpointsProtocol=https;AccountName=whopwhopstorage;AccountKey=qOnJtBPLDP90KFzOzo44ycw0HJUD+hBy19+k/0eMs+q76oUGtnvz7lGku3h/G6Fi8J4/DTyaw4HAZIQhDA6+NA==;EndpointSuffix=core.windows.net";
            var storageAccount = CloudStorageAccount.Parse(storageConnectionString);

            var tableClient = storageAccount.CreateCloudTableClient(new TableClientConfiguration());

            var table = tableClient.GetTableReference(_tableName);
            return table;
        }

    }

    public class WhopEntity : TableEntity
    {
        public WhopEntity() { }
        public WhopEntity(string id, string unumber)
        {
            PartitionKey = unumber;
            RowKey = id;
        }
        public string Body { get; set; }
        public string Name { get; set; }

    }

    public static class WhopExtensions
    {
        public static WhopRequest Map(this WhopEntity entity)
        {
            var map = new WhopRequest
            {
                Body = entity.Body,
                Name = entity.Name,
                UserId = entity.RowKey,
                UNumber = entity.PartitionKey,
                UtcTick = ToJavaScriptTick(entity.Timestamp.DateTime)
            };
            return map;
        }

        private static long ToJavaScriptTick(DateTime dateTimeOffset) => (long)dateTimeOffset.Subtract(new DateTime(1970,1,1,0,0,0,DateTimeKind.Utc)).TotalMilliseconds;
    }

    public class WhopRequest
    {
        public string Name { get; set; }
        public string UNumber { get; set; }
        public string Body { get; set; }
        public string UserId { get; set; }
        public long UtcTick { get; set; }
    }
}