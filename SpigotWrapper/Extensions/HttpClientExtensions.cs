using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace SpigotWrapper.Extensions;

public static class HttpClientExtensions
{
    public static async Task DownloadFileTaskAsync(this HttpClient client, Uri uri, string fileName)
    {
        using (var stream = await client.GetStreamAsync(uri))
        {
            using (var fileStream = new FileStream(fileName, FileMode.CreateNew))
            {
                await stream.CopyToAsync(fileStream);
            }
        }
    }
}