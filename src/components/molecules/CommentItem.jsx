import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import RichTextEditor from "@/components/molecules/RichTextEditor";
import { cn } from "@/utils/cn";

const CommentItem = ({ 
  comment, 
  onReply, 
  onEdit, 
  onDelete, 
  replies = [], 
  currentUser = "Current User",
  level = 0 
}) => {
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [showEditEditor, setShowEditEditor] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(comment.content);
  const [replyMentions, setReplyMentions] = useState([]);

  const isAuthor = comment.authorName === currentUser;
  const maxLevel = 3; // Maximum nesting level

  const formatContent = (content) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/@(\w+(?:\s+\w+)*)/g, '<span class="text-primary-600 font-medium">@$1</span>')
      .replace(/^• (.*)$/gm, '<li class="ml-4">$1</li>')
      .replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-outside">$1</ul>');
  };

  const handleReplySubmit = () => {
    if (replyContent.trim() && onReply) {
      onReply(comment.Id, replyContent, replyMentions);
      setReplyContent("");
      setReplyMentions([]);
      setShowReplyEditor(false);
    }
  };

  const handleEditSubmit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.Id, editContent);
      setShowEditEditor(false);
    }
  };

  const handleEditCancel = () => {
    setEditContent(comment.content);
    setShowEditEditor(false);
  };

  return (
    <div className={cn("group", level > 0 && "ml-6 pl-4 border-l-2 border-gray-100")}>
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {comment.authorAvatar}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900">{comment.authorName}</span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(comment.createdDate), { addSuffix: true })}
            </span>
            {comment.updatedDate !== comment.createdDate && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>

          {/* Comment Body */}
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            {showEditEditor ? (
              <RichTextEditor
                value={editContent}
                onChange={setEditContent}
                onSubmit={handleEditSubmit}
                onCancel={handleEditCancel}
                placeholder="Edit your comment..."
                className="border rounded-lg"
              />
            ) : (
              <div 
                className="text-gray-700 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatContent(comment.content) }}
              />
            )}

            {/* Actions */}
            {!showEditEditor && (
              <div className="flex items-center space-x-3 mt-2 pt-2 border-t border-gray-100">
                {level < maxLevel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyEditor(!showReplyEditor)}
                    className="text-xs p-1 h-auto"
                  >
                    <ApperIcon name="Reply" size={12} className="mr-1" />
                    Reply
                  </Button>
                )}
                
                {isAuthor && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEditEditor(true)}
                      className="text-xs p-1 h-auto"
                    >
                      <ApperIcon name="Edit" size={12} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete && onDelete(comment.Id)}
                      className="text-xs p-1 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={12} className="mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Reply Editor */}
          {showReplyEditor && (
            <div className="mt-3">
              <RichTextEditor
                value={replyContent}
                onChange={setReplyContent}
                onMention={setReplyMentions}
                mentions={replyMentions}
                onSubmit={handleReplySubmit}
                onCancel={() => {
                  setShowReplyEditor(false);
                  setReplyContent("");
                  setReplyMentions([]);
                }}
                placeholder={`Reply to ${comment.authorName}...`}
                className="border rounded-lg bg-white"
              />
            </div>
          )}

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.Id}
                  comment={reply}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  replies={replies.filter(r => r.parentId === reply.Id)}
                  currentUser={currentUser}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;