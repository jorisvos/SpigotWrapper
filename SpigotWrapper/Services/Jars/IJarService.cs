using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using SpigotWrapper.Config;
using SpigotWrapper.Models;

namespace SpigotWrapper.Services.Jars
{
    public interface IJarService
    {
        Task<IEnumerable<Jar>> GetAll();
        Task<Jar> Add(Jar jar, IFormFile file);
        Task<Jar> Get(Guid id);
        Task Remove(Guid id);
        Task<dynamic> DownloadLatest();
        Task<dynamic> DownloadJar(string jarDownloadUrl, string jarFileName, JarKind jarKind, string minecraftVersion);
        Task<string> GetJarPath(Guid id);
    }
}