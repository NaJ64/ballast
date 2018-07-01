namespace Ballast.Core.ValueObjects
{
    public class PlayerSignInRequest 
    {
        public string PlayerId { get; set; }
        public string PlayerName { get; set; }
        public string TimestampText { get; set; }
    }
}