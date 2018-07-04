using Ballast.Core.ValueObjects;

namespace Ballast.Core.Messaging.Events
{

    public class ChatMessageSentEventState : EventStateBase
    {
        public ChatMessage Message { get; set; }
    }

    public class ChatMessageSentEvent : EventBase 
    {

        public override string Id => nameof(ChatMessageSentEvent);

        public ChatMessage Message { get; private set; }

        private ChatMessageSentEvent(ChatMessage message, string isoDateTime = null) : base(isoDateTime)
        {
            Message = message;
        }

        public static implicit operator ChatMessageSentEvent(ChatMessageSentEventState state) =>
            new ChatMessageSentEvent(state.Message, state.IsoDateTime);

        public static ChatMessageSentEvent FromMessage(ChatMessage message) =>
            new ChatMessageSentEvent(message);

    }
}