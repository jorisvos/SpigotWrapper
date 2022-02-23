using System.Collections.Generic;
using SpigotWrapper.Models;
using SpigotWrapperLib.API;

namespace SpigotWrapper.Config
{
    public class JarConfig : IConfig
    {
        public List<Jar> Jars { get; set; }
    }
}