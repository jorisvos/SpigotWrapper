using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpigotWrapper.Config;
using SpigotWrapper.Models;
using SpigotWrapper.Services.Jars;
using SpigotWrapper.ViewModels;

namespace SpigotWrapper.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class JarController : ControllerBase
    {
        private readonly IJarService _jarService;

        public JarController(IJarService jarService)
        {
            _jarService = jarService ?? throw new ArgumentNullException(nameof(jarService));
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<Jar>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<Jar>>> All()
        {
            var jars = new List<Jar>();
            jars.AddRange(await _jarService.GetAll());
            return jars;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Upload([FromForm] Jar jar, ApiVersion version)
        {
            try
            {
                var uploadedJar = await _jarService.Add(jar, jar.File);

                return CreatedAtAction("GetById",
                    "Jar",
                    new { id = uploadedJar.Id, version = version.ToString() },
                    uploadedJar);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(Jar), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Jar>> GetById(Guid id)
        {
            var jar = await _jarService.Get(id);

            if (jar == null)
                return NotFound();
            return jar;
        }

        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(Guid id)
        {
            await _jarService.Remove(id);

            return NoContent();
        }

        [HttpPost("download")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<dynamic>> Download(JarDownloadRequest jarDownloadRequest)
        {
            var jar = await _jarService.DownloadJar(jarDownloadRequest.DownloadUrl, jarDownloadRequest.FileName,
                jarDownloadRequest.JarKind, jarDownloadRequest.MinecraftVersion);
            if (typeof(Error) == jar.GetType() && jar == Error.JarAlreadyDownloaded)
                return BadRequest("That version is already downloaded!");
            if (jar == null)
                return BadRequest();
            return jar;
        }

        [HttpPost("downloadlatest")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<dynamic>> DownloadLatest()
        {
            var jar = await _jarService.DownloadLatest();
            if (typeof(Error) == jar.GetType() && jar == Error.JarAlreadyDownloaded)
                return BadRequest(jar);
            if (jar == null)
                return BadRequest();
            return jar;
        }
    }
}