import React, { useState } from 'react';
import { Search, ThumbsUp, ThumbsDown, Check, MessageCircle } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';
import { format, parseISO } from 'date-fns';
import { Label } from './ui/label';
import { Card, CardContent } from '~/components/ui/card';

interface QAPost {
    question: string | null;
    askedBy: string | null;
    createdAt: string | null;
    replies: Reply[] | null;
    votes: Votes | null;
}

interface Reply {
    replyType: string | null;
    content: string | null;
    replies?: Reply[] | null;
    votes?: Votes | null;
}

interface Votes {
    upvotes: number | null;
    downvotes: number | null;
}

export type QAPosts = QAPost[];

const VprasanjaInOdgovori = ({ questions }: { questions: QAPosts }) => {
    const [iskalniNiz, nastaviIskalniNiz] = useState('');
    const [moznostRazvrscanja, nastaviMoznostRazvrscanja] = useState('newest');

    // Filtriraj vprašanja glede na iskalni niz
    const filteredQuestions = questions.filter(q =>
        !iskalniNiz || q.question?.toLowerCase().includes(iskalniNiz.toLowerCase())
    );

    // Razvrsti vprašanja glede na izbrano možnost
    const sortedQuestions = [...filteredQuestions].sort((a, b) => {
        if (moznostRazvrscanja === 'newest') {
            return new Date(b.createdAt || '') > new Date(a.createdAt || '') ? 1 : -1;
        }
        return 0;
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';

        try {
            const date = parseISO(dateString);
            const now = new Date();
            const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 + now.getMonth() - date.getMonth();

            return `pred ${diffMonths} meseci`;
        } catch (e) {
            return dateString;
        }
    };

    const renderReplies = (replies: Reply[] | null | undefined, depth: number = 0) => {
        if (!replies) return null;

        return replies.map((reply, index) => (
            <div key={index} className={`mt-4 ${depth > 0 ? 'ml-8' : ''}`}>
                <div className="border-l-4 border-purple-200 pl-4">
                    <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center bg-purple-100 text-purple-600 rounded-full w-6 h-6 mr-2">
                            <Check className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                            {reply.replyType === 'shop' ? 'Preverjen odgovor - Podpora' : 'Uporabnik'}
                        </span>
                    </div>
                    <p className="text-gray-700 mb-4">
                        {reply.content}
                    </p>

                    {/* Glasovanje */}
                    {reply.votes && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-1.5 hover:bg-purple-50">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{reply.votes.upvotes || 0}</span>
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-1.5 hover:bg-purple-50">
                                <ThumbsDown className="w-4 h-4" />
                                <span>{reply.votes.downvotes || 0}</span>
                            </Button>
                        </div>
                    )}
                </div>
                {renderReplies(reply.replies, depth + 1)}
            </div>
        ));
    };

    return (
        <div className="">
            {/* Glava */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Vprašanja in Odgovori</h2>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    POSTAVI VPRAŠANJE
                </Button>
            </div>

            {/* Iskalna vrstica */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
                        <Label htmlFor="search-input" className="text-lg">
                            Poišči odgovore na svoje vprašanje
                        </Label>
                        <div className="flex w-full gap-2">
                            <Input
                                id="search-input"
                                type="text"
                                placeholder="Išči..."
                                value={iskalniNiz}
                                onChange={(e) => nastaviIskalniNiz(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                aria-label="Iskanje"
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Število vprašanj in razvrščanje */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <p className="text-gray-700">
                    Showing {sortedQuestions.length} out of {questions.length} Questions
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-gray-700">Sort By</span>
                    <Select value={moznostRazvrscanja} onValueChange={nastaviMoznostRazvrscanja}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="popular">Popular</SelectItem>
                            <SelectItem value="relevant">Relevant</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Seznam vprašanj */}
            <div className="space-y-8">
                {sortedQuestions.map((post, index) => (
                    <div key={index} className="border-b pb-6">
                        <div className="flex gap-4">
                            {/* Vsebina vprašanja */}
                            <div className="flex-grow">
                                <div className="flex items-center text-sm text-gray-600 mb-3">
                                    <span>Vprašal/a: {post.askedBy}</span>
                                    <span className="mx-2">•</span>
                                    <span>{formatDate(post.createdAt)}</span>
                                </div>

                                <div className="flex items-center gap-3 mb-5">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white">
                                            Q
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800">
                                        {post.question}
                                    </h3>
                                </div>

                                {/* Odgovori in odgovori na odgovore */}
                                {renderReplies(post.replies)}

                                {/* Glasovanje za vprašanje */}
                                <div className="flex gap-2 mt-4">
                                    <Button variant="outline" size="sm" className="flex items-center gap-1.5 hover:bg-gray-100">
                                        <ThumbsUp className="w-4 h-4" />
                                        <span>{post.votes?.upvotes || 0}</span>
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex items-center gap-1.5 hover:bg-gray-100">
                                        <ThumbsDown className="w-4 h-4" />
                                        <span>{post.votes?.downvotes || 0}</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VprasanjaInOdgovori;