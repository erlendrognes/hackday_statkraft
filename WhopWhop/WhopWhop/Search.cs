using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using Microsoft.Extensions.Configuration;

namespace WhopWhop
{
    public class Search
    {
        private readonly GraphSettings _settings;

        public Search(IConfiguration configuration)
        {
            _settings = configuration.GetSection("Graph").Get<GraphSettings>();
        }
        
        [FunctionName("search")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
            ILogger log, ClaimsPrincipal principal)
        {
            if (principal.Identity == null)
            {
                return new UnauthorizedResult();
            }
            string nameQuery = req.Query["q"];

            var client = await GetClient(log);
            var stuff = await client.Users.Request(new List<Option>
                {new QueryOption("$filter", $"startsWith(givenName, '{nameQuery}')")}).GetAsync();
            
            return new ObjectResult(stuff.Select(s => new { Name = s.DisplayName, UserPrincipalName = s.UserPrincipalName}));
        }
        
        private async Task<GraphServiceClient> GetClient(ILogger logger)
        {
            var token = await GetToken(logger);

            return new GraphServiceClient(new DelegateAuthenticationProvider((requestMessage) =>
            {
                requestMessage
                    .Headers
                    .Authorization = new AuthenticationHeaderValue("Bearer", token);

                return Task.FromResult(0);
            }));
        }
        
        private async Task<string> GetToken(ILogger logger)
        {
            // With client credentials flows the scopes is ALWAYS of the shape "resource/.default", as the
            // application permissions need to be set statically (in the portal or by PowerShell), and then granted by
            // a tenant administrator
            string[] scopes = new[] { "https://graph.microsoft.com/.default" };
            try
            {
                IConfidentialClientApplication app = ConfidentialClientApplicationBuilder
                    .Create(_settings.ClientId)
                    .WithClientSecret(_settings.Secret)
                    .WithTenantId(_settings.TenantId)
                    .Build();
                var result = await app.AcquireTokenForClient(scopes).ExecuteAsync();
                return result.AccessToken;
            }
            catch (MsalUiRequiredException ex)
            {
                // The application does not have sufficient permissions
                // - did you declare enough app permissions in during the app creation?
                // - did the tenant admin needs to grant permissions to the application.
                logger.LogError($"Not sufficient privileges {ex.Message}");
            }
            catch (MsalServiceException ex) when (ex.Message.Contains("AADSTS70011"))
            {
                // Invalid scope. The scope has to be of the form "https://resourceurl/.default"
                // Mitigation: change the scope to be as expected !
                logger.LogError($"Invalid scope {ex.Message}");
            }

            throw new Exception("Shit");
        }
    }
}
