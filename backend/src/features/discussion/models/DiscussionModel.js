import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },

    parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null 
  },

    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    isEdited: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const DiscussionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['general', 'problem-help', 'algorithm', 'interview', 'bug-report', 'feature-request'],
        default: 'general'
    },
    tags: [{
        type: String,
        trim: true
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        default: null
    },
    views: {
        type: Number,
        default: 0
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isPinned: {
        type: Boolean,
        default: false
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    comments: [CommentSchema],
    lastActivityAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes
DiscussionSchema.index({ category: 1, createdAt: -1 });
DiscussionSchema.index({ userId: 1, createdAt: -1 });
DiscussionSchema.index({ problemId: 1 });
DiscussionSchema.index({ tags: 1 });
DiscussionSchema.index({ title: 'text', content: 'text' });

// Virtuals
DiscussionSchema.virtual('upvoteCount').get(function () {
    return this.upvotes.length;
});

DiscussionSchema.virtual('downvoteCount').get(function () {
    return this.downvotes.length;
});

DiscussionSchema.virtual('commentCount').get(function () {
    return this.comments.length;
});

DiscussionSchema.set('toJSON', { virtuals: true });
DiscussionSchema.set('toObject', { virtuals: true });

export default mongoose.model('Discussion', DiscussionSchema);