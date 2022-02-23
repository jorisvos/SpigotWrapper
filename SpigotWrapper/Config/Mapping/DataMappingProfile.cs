using AutoMapper;
using SpigotWrapper.Models;
using SpigotWrapperLib.Server;

namespace SpigotWrapper.Config.Mapping
{
    public class DataMappingProfile : Profile
    {
        public DataMappingProfile()
        {
            CreateMap<JarDto, Jar>();
            CreateMap<Jar, JarDto>();

            CreateMap<Plugin, PluginDto>();
            CreateMap<PluginDto, Plugin>();

            CreateMap<SpigotWrapperSetting, SpigotWrapperSettingDto>();
            CreateMap<SpigotWrapperSettingDto, SpigotWrapperSetting>();

            CreateMap<Server, ServerDto>();
            CreateMap<ServerDto, Server>();

            CreateMap<Server, Wrapper>();
            CreateMap<Wrapper, Server>();
        }
    }
}