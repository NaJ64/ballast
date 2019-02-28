using System.Threading.Tasks;

namespace Ballast.Client 
{
    public interface IClientBootstrapper 
    {
        Task ConnectAsync();
    }
}