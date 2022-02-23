using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SpigotWrapper.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}")]
    public class SpigotWrapperController : ControllerBase
    {
        [HttpGet("status")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult Status()
        {
            return Ok("{\"message\": \"up and running\"}");
        }
    }
}