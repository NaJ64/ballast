namespace Ballast.Core.Application.Models
{
    public class PlayerSignInRequest 
    {
        public Guid PlayerId { get; set; }
        public string PlayerName { get; set; }
        public DateTime Timestamp { get; set; }
    }
}