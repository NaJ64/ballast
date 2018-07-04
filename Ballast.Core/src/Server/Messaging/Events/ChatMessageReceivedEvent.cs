using Ballast.Core.ValueObjects;

namespace Ballast.Core.Messaging.Events
{

    public class ChatMessageReceivedEventState : EventStateBase
    {
        public ChatMessage Message { get; set; }
    }

    public class ChatMessageReceivedEvent : EventBase 
    {

        public override string Id => nameof(ChatMessageReceivedEvent);

        public ChatMessage Message { get; private set; }

        private ChatMessageReceivedEvent(ChatMessage message, string isoDateTime = null) : base(isoDateTime)
        {
            Message = message;
        }

        public static implicit operator ChatMessageReceivedEvent(ChatMessageReceivedEventState state) =>
            new ChatMessageReceivedEvent(state.Message, state.IsoDateTime);

        public static ChatMessageReceivedEvent FromMessage(ChatMessage message) =>
            new ChatMessageReceivedEvent(message);

    }
}