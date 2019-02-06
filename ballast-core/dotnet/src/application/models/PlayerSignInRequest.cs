namespace Ballast.Core.Application.Models
{
    public class PlayerSignInRequest 
    {
        public string PlayerId { get; set; }
        public string PlayerName { get; set; }
        public string SentOnDateIsoString { get; set; }
    }
}