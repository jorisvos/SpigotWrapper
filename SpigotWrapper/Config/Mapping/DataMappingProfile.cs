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

            CreateMap<PluginModel, PluginDto>();
            CreateMap<PluginDto, PluginModel>();

            CreateMap<PluginModel, SpigotWrapperLib.Plugin.Plugin>();
            CreateMap<SpigotWrapperLib.Plugin.Plugin, PluginModel>();

            CreateMap<SpigotWrapperSetting, SpigotWrapperSettingDto>();
            CreateMap<SpigotWrapperSettingDto, SpigotWrapperSetting>();

            CreateMap<Server, ServerDto>();
            CreateMap<ServerDto, Server>();

            CreateMap<PluginServer, PluginServerDto>();
            CreateMap<PluginServerDto, PluginServer>();

            CreateMap<Server, Wrapper>();
            CreateMap<Wrapper, Server>();
        }
    }
}