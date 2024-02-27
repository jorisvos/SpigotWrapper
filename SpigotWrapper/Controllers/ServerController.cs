using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpigotWrapper.Models;
using SpigotWrapper.Services.Servers;
using SpigotWrapperLib.Log;
using SpigotWrapperLib.Server;

namespace SpigotWrapper.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ServerController : ControllerBase
    {
        private readonly IServerService _serverService;

        public ServerController(IServerService serverService)
        {
            _serverService = serverService ?? throw new ArgumentNullException(nameof(serverService));
        }

        #region ServerManager operations

        [HttpGet("stopall")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult StopAll()
        {
            ServerService.ServerManager.StopAll();
            return NoContent();
        }
        
        [HttpGet("killall")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult KillAll()
        {
            ServerService.ServerManager.KillAll();
            return NoContent();
        }

        [HttpGet("wait")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult Wait()
        {
            ServerService.ServerManager.WaitForAllToStop();
            return NoContent();
        }

        [HttpGet("log")]
        [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public FileStreamResult SpigotWrapperLog()
        {
            return new FileStreamResult(System.IO.File.OpenRead(Logger.LatestLog), "application/octet-stream");
        }

        [HttpGet("info")]
        [ProducesResponseType(typeof(List<Wrapper>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<Wrapper>> AllInfo()
        {
            return ServerService.ServerManager.GetAllInfo();
        }

        [HttpGet("info/{count:int}")]
        [ProducesResponseType(typeof(List<Wrapper>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<Wrapper>> AllInfoCount(int count)
        {
            return ServerService.ServerManager.GetAllInfo(count);
        }

        [HttpGet("{id:guid}/start")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<bool> Start(Guid id)
        {
            return ServerService.ServerManager.StartServer(id);
        }

        [HttpGet("{id:guid}/stop")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<bool> Stop(Guid id)
        {
            return ServerService.ServerManager.StopServer(id);
        }
        
        [HttpGet("{id:guid}/kill")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<bool> Kill(Guid id)
        {
            return ServerService.ServerManager.KillServer(id);
        }

        [HttpGet("{id:guid}/accepteula")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<bool> AcceptEula(Guid id)
        {
            return ServerService.ServerManager.AcceptEula(id);
        }

        [HttpGet("{id:guid}/info")]
        [ProducesResponseType(typeof(Wrapper), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Wrapper> Info(Guid id)
        {
            return ServerService.ServerManager.GetInfo(id);
        }

        [HttpPost("{id:guid}/command")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<bool> Command(Guid id, [FromQuery] string command)
        {
            return ServerService.ServerManager.ExecuteCommand(id, command);
        }

        [HttpGet("{id:guid}/log")]
        [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult Log(Guid id)
        {
            if (!System.IO.File.Exists(ServerService.ServerManager.LatestLog(id)))
                return NotFound();
            return new FileContentResult(System.IO.File.ReadAllBytes(ServerService.ServerManager.LatestLog(id)), "application/octet-stream");
        }

        [HttpGet("{id:guid}/minecraftlog")]
        [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult MinecraftLog(Guid id)
        {
            if (!System.IO.File.Exists(ServerService.ServerManager.LatestMinecraftLog(id)))
                return NotFound();
            return new FileContentResult(System.IO.File.ReadAllBytes(ServerService.ServerManager.LatestMinecraftLog(id)),
                "application/octet-stream");
        }

        [HttpGet("{id:guid}/running")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<bool> Running(Guid id)
        {
            return ServerService.ServerManager.IsRunning(id);
        }

        [HttpGet("{id:guid}/wait")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult WaitForStop(Guid id)
        {
            ServerService.ServerManager.WaitForStop(id);
            return NoContent();
        }

        [HttpGet("{id:guid}/plugins")]
        [ProducesResponseType(typeof(string[]), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<string[]> Plugins(Guid id)
        {
            return ServerService.ServerManager.GetPlugins(id);
        }

        #endregion

        #region Database operations

        [HttpGet]
        [ProducesResponseType(typeof(List<Server>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<Server>>> All()
        {
            var servers = new List<Server>();
            servers.AddRange(await _serverService.GetAll());
            return servers;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Add([FromForm] Server server, ApiVersion version)
        {
            try
            {
                server.JavaArguments ??= "-jar -Xms128M -Xmx1G %jar% nogui";
                var createdServer = await _serverService.Add(server);

                return CreatedAtAction("GetById",
                    "Server",
                    new { id = createdServer.Id, version = version.ToString() },
                    createdServer);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(Server), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Server>> GetById(Guid id, [FromQuery] bool enrichEnabledPlugins = true)
        {
            var server = await _serverService.Get(id, enrichEnabledPlugins);

            if (server == null)
                return NotFound();
            return server;
        }

        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(Guid id)
        {
            //TODO: add backup system, because now it's just gone once removed
            try
            {
                await _serverService.Remove(id);

                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        #endregion
    }
}