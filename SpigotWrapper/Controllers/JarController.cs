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
        [RequestSizeLimit(100_000_000)]
        public async Task<ActionResult> Upload([FromForm] Jar jar, ApiVersion version)
        {
            //TODO: add a check that the file ends with the .jar extension
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
        [ProducesResponseType(typeof(Error), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(Guid id)
        {
            var result = await _jarService.Remove(id);
            if (result == null || typeof(Error) == result.GetType() && (result == Error.JarInUse || result == Error.JarDoesNotExist))
                return BadRequest(result);
            return NoContent();
        }

        [HttpPost("download")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<dynamic>> Download(JarDownloadRequest jarDownloadRequest)
        {
            var jar = await _jarService.DownloadJar(jarDownloadRequest.DownloadUrl, jarDownloadRequest.FileName,
                jarDownloadRequest.JarKind, jarDownloadRequest.MinecraftVersion);
            if (jar == null || typeof(Error) == jar.GetType() && jar == Error.JarAlreadyDownloaded)
                return BadRequest(jar);
            return jar;
        }

        [HttpPost("download-latest")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<dynamic>> DownloadLatest()
        {
            var jar = await _jarService.DownloadLatest();
            if (jar == null || typeof(Error) == jar.GetType() && jar == Error.JarAlreadyDownloaded)
                return BadRequest(jar);
            return jar;
        }
    }
}