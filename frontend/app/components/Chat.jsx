/**
 * Chat Components
 *
 * This file contains all chat-related components for the messaging interface.
 * It demonstrates:
 * 1. LOGICAL GROUPING: Related components organized in the same file
 * 2. COMPONENT HIERARCHY: Message -> ChatMessages -> ChatInput
 * 3. EXPORT PATTERNS: Multiple named exports from a single file
 * 4. REUSABLE MODULES: Components that can be imported anywhere in the app
 */

/**
 * Message Component
 *
 * A reusable component for displaying individual chat messages.
 * Accepts props to customize message type and uses props.children for message content.
 * https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children
 */
function Message(props) {
  return (
    <div className={`message ${props.type}-message`}>
      <div className="message-content">{props.children}</div>
    </div>
  );
}

/**
 * ChatMessages Component
 *
 * Now this component receives data via PROPS! Key concepts:
 * 1. PROPS ACCEPTANCE: Component accepts a 'messages' prop from parent
 * 2. DATA FLOW: Data flows down from parent (Home) to child (ChatMessages)
 * 3. COMPONENT REUSABILITY: Can work with any messages array passed as props
 * 4. SEPARATION OF CONCERNS: Component focuses on rendering, parent manages data
 * 5. MAP() WITH PROPS: Uses props.messages instead of internal data
 */
function ChatMessages(props) {
  return (
    <div className="chat-messages">
      {/* Using props.messages - data comes from parent component! */}
      {props.messages.map((message) => (
        <Message key={message.id} type={message.type}>
          {message.content}
        </Message>
      ))}
    </div>
  );
}

/**
 * ChatInput Component
 *
 * Form component that handles user input for sending messages.
 * Contains textarea and send button for message composition.
 */
function ChatInput() {
  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <textarea
          className="chat-input"
          placeholder="Type your message here..."
          rows="1"
        />
        <button className="send-button" type="button">
          Send
        </button>
      </div>
    </div>
  );
}

/**
 * Named Exports
 *
 * We export each component individually so they can be imported separately
 * if needed. This provides flexibility in how components are used.
 */
export { Message, ChatMessages, ChatInput };
