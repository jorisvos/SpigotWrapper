using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpigotWrapper.Models;
using SpigotWrapper.Services.Plugins;

namespace SpigotWrapper.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class PluginController : ControllerBase
    {
        private readonly IPluginService _pluginService;

        public PluginController(IPluginService pluginService)
        {
            _pluginService = pluginService ?? throw new ArgumentNullException(nameof(pluginService));
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<PluginModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<PluginModel>>> All()
        {
            var plugins = new List<PluginModel>();
            plugins.AddRange(await _pluginService.GetAll());
            return plugins;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Upload([FromForm] PluginModel plugin, ApiVersion version)
        {
            //TODO: add check that checks if the uploaded file has the .dll??? extension
            try
            {
                var uploadedPlugin = await _pluginService.Add(plugin, plugin.File);

                return CreatedAtAction("GetById",
                    "Plugin",
                    new { id = uploadedPlugin.Id, version = version.ToString() },
                    uploadedPlugin);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(PluginModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PluginModel>> GetById(Guid id)
        {
            var plugin = await _pluginService.Get(id);

            if (plugin == null)
                return NotFound();
            return plugin;
        }

        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(Guid id)
        {
            await _pluginService.Remove(id);

            return NoContent();
        }
    }
}