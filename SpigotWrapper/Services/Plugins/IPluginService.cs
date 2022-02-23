using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using SpigotWrapper.Models;

namespace SpigotWrapper.Services.Plugins
{
    public interface IPluginService
    {
        Task<IEnumerable<Plugin>> GetAll();
        Task<Plugin> Add(Plugin jar, IFormFile file);
        Task<Plugin> Get(Guid id);
        Task Remove(Guid id);
    }
}