namespace Ballast.Core.ValueObjects
{
    public class PlayerSignOutRequest 
    {
        public string PlayerId { get; set; }
        public string SentOnDateIsoString { get; set; }
    }
}