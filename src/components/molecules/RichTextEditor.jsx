import React, { useState, useRef } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Write a comment...",
  onMention,
  mentions = [],
  onSubmit,
  onCancel,
  showActions = true,
  className = ""
}) => {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);

  const availableUsers = [
    { name: "Sarah Johnson", avatar: "SJ" },
    { name: "Mike Chen", avatar: "MC" },
    { name: "Emily Rodriguez", avatar: "ER" },
    { name: "David Kim", avatar: "DK" },
    { name: "Lisa Park", avatar: "LP" },
    { name: "John Anderson", avatar: "JA" },
    { name: "Alex Thompson", avatar: "AT" },
    { name: "Rachel Green", avatar: "RG" },
    { name: "Tom Wilson", avatar: "TW" },
    { name: "Maria Garcia", avatar: "MG" }
  ];

  const formatText = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let newText = value;

    switch (format) {
      case 'bold':
        newText = value.substring(0, start) + `**${selectedText || 'bold text'}**` + value.substring(end);
        break;
      case 'italic':
        newText = value.substring(0, start) + `*${selectedText || 'italic text'}*` + value.substring(end);
        break;
      case 'code':
        newText = value.substring(0, start) + `\`${selectedText || 'code'}\`` + value.substring(end);
        break;
      case 'bullet':
        const lines = value.split('\n');
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const currentLine = value.substring(lineStart, start);
        if (currentLine.trim() === '') {
          newText = value.substring(0, start) + '• ' + value.substring(start);
        } else {
          newText = value.substring(0, start) + '\n• ' + value.substring(start);
        }
        break;
      default:
        break;
    }

    onChange(newText);
    
    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursor = start + (newText.length - value.length);
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(newValue);
    setCursorPosition(cursorPos);

    // Check for @ mentions
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowMentions(true);
    } else {
      setShowMentions(false);
      setMentionQuery("");
    }
  };

  const insertMention = (user) => {
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      const beforeMention = textBeforeCursor.substring(0, mentionMatch.index);
      const newValue = beforeMention + `@${user.name} ` + textAfterCursor;
      onChange(newValue);
      
      if (onMention) {
        onMention([...mentions, user.name]);
      }
    }
    
    setShowMentions(false);
    setMentionQuery("");
    
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (onSubmit && value.trim()) {
      onSubmit();
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Formatting Toolbar */}
      <div className="flex items-center space-x-1 p-2 border-b border-gray-200 bg-gray-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          className="p-1.5"
          title="Bold"
        >
          <ApperIcon name="Bold" size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          className="p-1.5"
          title="Italic"
        >
          <ApperIcon name="Italic" size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('code')}
          className="p-1.5"
          title="Code"
        >
          <ApperIcon name="Code" size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('bullet')}
          className="p-1.5"
          title="Bullet List"
        >
          <ApperIcon name="List" size={14} />
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMentions(!showMentions)}
          className="p-1.5"
          title="Mention User"
        >
          <ApperIcon name="AtSign" size={14} />
        </Button>
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        placeholder={placeholder}
        className="w-full p-3 border-0 resize-none focus:outline-none focus:ring-0 min-h-[100px]"
        rows={4}
      />

      {/* Mentions Dropdown */}
      {showMentions && (
        <div className="absolute z-10 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <button
                key={user.name}
                onClick={() => insertMention(user)}
                className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 text-left"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {user.avatar}
                </div>
                <span className="text-sm">{user.name}</span>
              </button>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">No users found</div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center justify-end space-x-2 p-3 border-t border-gray-200 bg-gray-50">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="gap-2"
          >
            <ApperIcon name="Send" size={14} />
            Comment
          </Button>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;