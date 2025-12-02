/**
 * Sidebar Components
 *
 * This file demonstrates React component organization and modularity:
 * 1. Multiple related components in one file
 * 2. Import/export patterns for sharing components
 * 3. Component composition and hierarchy
 * 4. File organization for better project structure
 */

/**
 * SidebarHeader Component
 *
 * Handles the top section of the sidebar with title and new chat button.
 * This component demonstrates single responsibility and reusability.
 */
function SidebarHeader() {
  return (
    <div className="sidebar-header">
      <h2 className="chatbot-title">Chatbot</h2>
      <a href="/chat/new" className="new-chat-btn">
        + New
      </a>
    </div>
  );
}

/**
 * ChatThreadItem Component
 *
 * A reusable component for individual chat thread links.
 * Demonstrates props usage: receives href and title from parent component.
 * This pattern allows the same component structure with different data.
 */
function ChatThreadItem(props) {
  return (
    <li className="chat-thread-item">
      <a href={props.href} className="chat-thread-link">
        {props.title}
      </a>
    </li>
  );
}

/**
 * ChatThreadsList Component
 *
 * Now receives data via PROP DRILLING! This demonstrates:
 * 1. PROP DRILLING: Data flows Layout -> Sidebar -> ChatThreadsList
 * 2. COMPONENT REUSABILITY: Can work with any threads array passed as props
 * 3. DATA FLOW: Shows how data moves through multiple component layers
 * 4. CONSISTENT PATTERNS: Uses same props.data.map() pattern as ChatMessages
 */
function ChatThreadsList(props) {
  return (
    <nav className="chat-threads-list" aria-label="Chat threads">
      <ul>
        {/* Using props.threads - data passed down through prop drilling! */}
        {props.threads.map((thread) => (
          <ChatThreadItem
            key={thread.id}
            href={thread.href}
            title={thread.title}
          />
        ))}
      </ul>
    </nav>
  );
}

/**
 * SidebarFooter Component
 *
 * Handles the user profile section at the bottom of the sidebar.
 * Demonstrates component modularity and independence.
 */
function SidebarFooter() {
  return (
    <div className="sidebar-footer">
      <a href="/profile" className="user-profile">
        <img
          src="https://ui-avatars.com/api/?name=Batman&background=0D0D0D&color=fff&size=40"
          alt="User avatar"
          className="user-avatar"
          width={30}
          height={30}
        />
        <span className="user-name">Batman</span>
      </a>
    </div>
  );
}

/**
 * Main Sidebar Component
 *
 * Now demonstrates PROP DRILLING - receiving props and passing them down:
 * 1. PROPS ACCEPTANCE: Receives 'threads' prop from Layout parent
 * 2. PROP DRILLING: Passes threads down to ChatThreadsList child
 * 3. INTERMEDIATE COMPONENT: Acts as bridge between Layout and ChatThreadsList
 * 4. COMPONENT COMPOSITION: Combines multiple components while managing data flow
 */
export default function Sidebar(props) {
  return (
    <aside className="sidebar">
      {/* Component composition with prop drilling */}
      <SidebarHeader />
      <ChatThreadsList threads={props.threads} />
      <SidebarFooter />
    </aside>
  );
}
