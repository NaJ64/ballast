namespace Ballast.Core.Application.Models
{
    public class PlayerSignOutRequest 
    {
        public string PlayerId { get; set; }
        public string SentOnDateIsoString { get; set; }
    }
}