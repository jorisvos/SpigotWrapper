using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Http;
using SpigotWrapper.Config;
using SpigotWrapper.Extensions;
using SpigotWrapper.Models;
using SpigotWrapper.Repositories.Jars;
using SpigotWrapperLib;
using SpigotWrapperLib.Log;

namespace SpigotWrapper.Services.Jars
{
    public class JarService : IJarService
    {
        public static readonly string JarPath = Path.Combine(Main.RootPath, "jars");
        private readonly IJarRepository _jarRepository;
        private readonly Logger _logger;

        public JarService(IJarRepository jarRepository)
        {
            _jarRepository = jarRepository;
            _logger = new Logger(GetType().Name);
        }

        public async Task<IEnumerable<Jar>> GetAll()
        {
            return await _jarRepository.All();
        }

        public async Task<Jar> Add(Jar jar, IFormFile file)
        {
            jar.FileName = file.FileName;

            await CheckForUniqueConstraints(jar);

            var uploadedJar = await _jarRepository.Add(jar);
            var filePath = Path.Combine(JarPath, jar.FileName);

            await using var stream = File.Create(filePath);
            await file.CopyToAsync(stream);
            _logger.Info($"Added {jar.JarKind} ({jar.MinecraftVersion})");

            return uploadedJar;
        }

        public async Task<Jar> Get(Guid id)
        {
            return await _jarRepository.Get(id);
        }

        // TODO: check for Server with this Jar before deleting and write error when it is used
        public async Task Remove(Guid id)
        {
            var jar = await _jarRepository.Get(id);
            await _jarRepository.Remove(id);
            File.Delete(Path.Combine(JarPath, jar.FileName));
            _logger.Info($"Removed {jar.JarKind} ({jar.MinecraftVersion})");
        }

        public async Task<dynamic> DownloadLatest()
        {
            var web = new HtmlWeb();
            var doc = await web.LoadFromWebAsync("https://www.minecraft.net/nl-nl/download/server");
            var element =
                doc.DocumentNode.SelectSingleNode(
                    "//*[@id='main-content']/div/div/div/div/div/div/div[2]/div/div/p[1]/a");

            var jarDownloadUrl = element.Attributes["href"].Value;
            var jarFileName = element.InnerText;
            var minecraftVersion = string.Join('.', jarFileName.Split('.')[1..^1]);

            return await DownloadJar(jarDownloadUrl, jarFileName, JarKind.Vanilla, minecraftVersion);
        }

        public async Task<dynamic> DownloadJar(string jarDownloadUrl, string jarFileName, JarKind jarKind,
            string minecraftVersion)
        {
            if (string.IsNullOrEmpty(jarDownloadUrl) || string.IsNullOrEmpty(jarFileName) ||
                string.IsNullOrEmpty(minecraftVersion))
                return null;
            if (File.Exists(Path.Combine(JarPath, jarFileName)))
                return Error.JarAlreadyDownloaded;

            var jar = new Jar { FileName = jarFileName, JarKind = jarKind, MinecraftVersion = minecraftVersion };
            await CheckForUniqueConstraints(jar);

            using var httpClient = new HttpClient();
            await httpClient.DownloadFileTaskAsync(new Uri(jarDownloadUrl), Path.Combine(JarPath, jarFileName));
            _logger.Info($"Downloaded {jarKind} ({minecraftVersion})");

            return await _jarRepository.Add(jar);
        }

        public async Task<string> GetJarPath(Guid id)
        {
            var jar = await Get(id);
            return Path.Combine(JarPath, jar.FileName);
        }

        private async Task CheckForUniqueConstraints(Jar jar)
        {
            var jars = (await _jarRepository.All()).ToArray();
            if (jars.Any(j => j.FileName == jar.FileName))
            {
                _logger.Error("The jar filename must be unique.");
                throw new Exception(Error.JarFilenameMustBeUnique.ToString());
            }

            if (jars.Any(j => j.JarKind == jar.JarKind && j.MinecraftVersion == jar.MinecraftVersion))
            {
                _logger.Error("The jar kind and minecraft version must be unique.");
                throw new Exception(Error.JarKindAndVersionMustBeUniqueTogether.ToString());
            }
        }
    }
}