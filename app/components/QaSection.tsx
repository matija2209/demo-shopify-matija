import React, { useState } from 'react';
import { Search, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
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

interface QAPost {
    question: string | null;
    askedBy: string | null;
    createdAt: string | null;
    answers: Answer[] | null;
    votes: Votes | null;
}

interface Answer {
    answerType: string | null;
    content: string | null;
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
        // Dodaj več možnosti razvrščanja po potrebi
        return 0;
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Funkcionalnost iskanja bi bila tukaj
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

    return (
        <div className="w-full max-w-6xl mx-auto">
            {/* Glava */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Vprašanja in Odgovori</h2>
                <Button className="">
                    POSTAVI VPRAŠANJE
                </Button>
            </div>

            {/* Iskalna vrstica */}
            <div className="bg-gray-100 p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <Label htmlFor="search-input" className="">
                    Poišči odgovore na svoje vprašanje
                </Label>
                <form onSubmit={handleSearch} className="flex w-full gap-2">
                    <Input
                        id="search-input"
                        type="text"
                        placeholder="Išči..."
                        value={iskalniNiz}
                        onChange={(e) => nastaviIskalniNiz(e.target.value)}
                    />
                    <Button
                        type="submit"

                        aria-label="Iskanje"
                    >
                        <Search className="h-5 w-5 " />
                    </Button>
                </form>
            </div>

            {/* Število vprašanj in razvrščanje */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <p className="text-gray-700">
                    Prikazanih {sortedQuestions.length} od {questions.length} vprašanj
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-gray-700">Razvrsti po</span>
                    <Select value={moznostRazvrscanja} onValueChange={nastaviMoznostRazvrscanja}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Razvrsti po" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Najnovejše</SelectItem>
                            <SelectItem value="popular">Priljubljeno</SelectItem>
                            <SelectItem value="relevant">Relevantno</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Seznam vprašanj */}
            <div className="space-y-8">
                {sortedQuestions.map((post, index) => (
                    <div key={index} className="border-b pb-8">
                        <div className="flex gap-4">
                            {/* Ikona vprašanja */}
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white">
                                    V
                                </div>
                            </div>

                            {/* Vsebina vprašanja */}
                            <div className="flex-grow">
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                    <span>Vprašal {post.askedBy}</span>
                                    <span className="mx-2">•</span>
                                    <span>{formatDate(post.createdAt)}</span>
                                </div>

                                <div className="text-gray-800 mb-4">
                                    {post.question}
                                </div>

                                {/* Odgovori */}
                                {post.answers?.map((answer, answerIndex) => (
                                    <div key={answerIndex} className="border-l-4 border-blue-100 pl-4 mt-4">
                                        <div className="flex items-center mb-2">
                                            <div className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-full w-6 h-6 mr-2">
                                                <Check className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">
                                                Preverjen odgovor - Podpora
                                            </span>
                                        </div>
                                        <p className="text-gray-700 mb-4">
                                            {answer.content}
                                        </p>

                                        {/* Glasovanje */}
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                                                <ThumbsUp className="w-4 h-4" />
                                                <span>{post.votes?.upvotes || 0}</span>
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                                                <ThumbsDown className="w-4 h-4" />
                                                <span>{post.votes?.downvotes || 0}</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VprasanjaInOdgovori;