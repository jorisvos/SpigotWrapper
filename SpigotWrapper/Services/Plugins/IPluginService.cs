using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using SpigotWrapper.Models;

namespace SpigotWrapper.Services.Plugins
{
    public interface IPluginService
    {
        Task<IEnumerable<PluginModel>> GetAll();
        Task<PluginModel> Add(PluginModel jar, IFormFile file);
        Task<PluginModel> Get(Guid id);
        Task<dynamic> Remove(Guid id);
    }
}