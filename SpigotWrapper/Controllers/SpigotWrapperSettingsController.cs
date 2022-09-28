using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpigotWrapper.Models;
using SpigotWrapper.Services.SpigotWrapperSettings;

namespace SpigotWrapper.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class SpigotWrapperSettingsController : ControllerBase
    {
        private readonly ISpigotWrapperSettingsService _spigotWrapperSettingsService;

        public SpigotWrapperSettingsController(ISpigotWrapperSettingsService spigotWrapperSettingsService)
        {
            _spigotWrapperSettingsService = spigotWrapperSettingsService ??
                                            throw new ArgumentNullException(nameof(spigotWrapperSettingsService));
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<SpigotWrapperSetting>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<SpigotWrapperSetting>>> All()
        {
            var spigotWrapperSettings = new List<SpigotWrapperSetting>();
            spigotWrapperSettings.AddRange(await _spigotWrapperSettingsService.GetAll());
            return spigotWrapperSettings;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Add([FromForm] SpigotWrapperSetting spigotWrapperSetting, ApiVersion version)
        {
            try
            {
                var createdSpigotWrapperSetting = await _spigotWrapperSettingsService.Add(spigotWrapperSetting);

                return CreatedAtAction("GetById",
                    "SpigotWrapperSettings",
                    new { key = createdSpigotWrapperSetting.Key, version = version.ToString() },
                    createdSpigotWrapperSetting);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        [ProducesResponseType(typeof(SpigotWrapperSetting), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SpigotWrapperSetting>> Update(
            [FromForm] SpigotWrapperSetting spigotWrapperSetting, ApiVersion version)
        {
            return await _spigotWrapperSettingsService.Update(spigotWrapperSetting);
        }

        [HttpGet("{key}")]
        [ProducesResponseType(typeof(SpigotWrapperSetting), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SpigotWrapperSetting>> GetById(string key)
        {
            var spigotWrapperSetting = await _spigotWrapperSettingsService.Get(key);

            if (spigotWrapperSetting == null)
                return NotFound();
            return spigotWrapperSetting;
        }

        [HttpDelete("{key}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(string key)
        {
            await _spigotWrapperSettingsService.Remove(key);

            return NoContent();
        }
    }
}