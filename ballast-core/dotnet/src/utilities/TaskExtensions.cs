
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Ballast.Core.Utilities 
{
    public static class TaskExtensions
    {
        public static async void Forget(this Task task, params Type[] acceptableExceptions)
        {
            // Solution proposed by Stephen Cleary
            // https://stackoverflow.com/questions/22864367/fire-and-forget-approach/22864616#22864616
            try
            {
                await task.ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                // TODO: consider whether derived types are also acceptable.
                if (!acceptableExceptions.Contains(ex.GetType()))
                throw;
            }
        }
    }
}