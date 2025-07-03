'use client';

import React, { useState, useRef, useMemo, ChangeEvent, FC } from 'react';

// --- Types ---
interface FavoriteLink {
    id: string;
    link: string;
    type: string;
    name: string;
}

interface LinkItemProps {
    name: string;
    link: string;
    type: string;
    isFavorite?: boolean;
    favoriteId?: string | null;
    onRemoveFavorite?: (id: string) => void;
    isCurrentlyFavorited: boolean;
    username: string;
    generatedLinkOverrides: Record<string, string>;
    setEditingGeneratedLink: React.Dispatch<React.SetStateAction<{ id: string; value: string } | null>>;
    setEditingFavoriteLink: React.Dispatch<React.SetStateAction<{ id: string; value: string } | null>>;
    editingGeneratedLink: { id: string; value: string } | null;
    editingFavoriteLink: { id: string; value: string } | null;
    handleEditGeneratedSave: () => void;
    handleEditFavoriteSave: () => void;
    handleResetSpecificGeneratedEdit: (id: string) => void;
    toggleFavorite: (link: string, type: string, name: string) => void;
    copyToClipboard: (text: string, type?: string) => void;
    handleMailtoClick: () => void;
    handleEditGeneratedStart: (id: string, value: string) => void;
    handleEditFavoriteStart: (id: string, value: string) => void;
}

// --- Helper Component ---
const LinkItem: FC<LinkItemProps> = ({
    name,
    link,
    type,
    isFavorite = false,
    favoriteId = null,
    onRemoveFavorite,
    isCurrentlyFavorited,
    username,
    generatedLinkOverrides,
    setEditingGeneratedLink,
    setEditingFavoriteLink,
    editingGeneratedLink,
    editingFavoriteLink,
    handleEditGeneratedSave,
    handleEditFavoriteSave,
    handleResetSpecificGeneratedEdit,
    toggleFavorite,
    copyToClipboard,
    handleMailtoClick,
    handleEditGeneratedStart,
    handleEditFavoriteStart,
}) => {
    const uniqueId = isFavorite ? favoriteId : `${type}-${name}`;
    const isCurrentlyEditingGenerated = editingGeneratedLink && editingGeneratedLink.id === uniqueId;
    const isCurrentlyEditingFavorite = editingFavoriteLink && editingFavoriteLink.id === uniqueId;

    const currentLinkValue = isCurrentlyEditingGenerated
        ? editingGeneratedLink.value
        : isCurrentlyEditingFavorite
        ? editingFavoriteLink.value
        : link;

    const displayLink = isFavorite
        ? link
        : username.trim()
        ? typeof uniqueId === 'string' && generatedLinkOverrides[uniqueId] !== undefined
            ? generatedLinkOverrides[uniqueId]
            : link
        : '';

    const isEdited =
        !isFavorite && typeof uniqueId === 'string' && generatedLinkOverrides[uniqueId] !== undefined;

    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col justify-between w-full">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-semibold text-gray-700">{name}</h3>
                <div className="flex items-center space-x-1">
                    {isEdited && (
                        <button
                            onClick={() => handleResetSpecificGeneratedEdit(uniqueId as string)}
                            className="p-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
                            title="Reset to original"
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="1 4 1 10 7 10"></polyline>
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                            </svg>
                        </button>
                    )}
                    {displayLink && !isFavorite ? (
                        <button
                            onClick={() => toggleFavorite(displayLink, type, name)}
                            className={`p-1 rounded-md transition duration-150 ease-in-out ${
                                isCurrentlyFavorited
                                    ? 'bg-yellow-300 text-yellow-800'
                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}
                            title={isCurrentlyFavorited ? 'Remove from Saved Links' : 'Add to Saved Links'}
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isCurrentlyFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </button>
                    ) : (
                        isFavorite &&
                        onRemoveFavorite && (
                            <button
                                onClick={() => onRemoveFavorite(favoriteId as string)}
                                className="p-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition duration-150 ease-in-out"
                                title="Remove from Saved Links"
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>
                        )
                    )}
                </div>
            </div>
            {displayLink ? (
                <div className="flex items-center space-x-2">
                    {(isCurrentlyEditingGenerated || isCurrentlyEditingFavorite) ? (
                        <input
                            type="text"
                            value={currentLinkValue || ''}
                            onChange={e => {
                                if (isCurrentlyEditingGenerated) {
                                    setEditingGeneratedLink(prev => (prev ? { ...prev, value: e.target.value } : null));
                                } else if (isCurrentlyEditingFavorite) {
                                    setEditingFavoriteLink(prev => (prev ? { ...prev, value: e.target.value } : null));
                                }
                            }}
                            onBlur={() => {
                                if (isCurrentlyEditingGenerated) {
                                    handleEditGeneratedSave();
                                } else if (isCurrentlyEditingFavorite) {
                                    handleEditFavoriteSave();
                                }
                            }}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    if (isCurrentlyEditingGenerated) {
                                        handleEditGeneratedSave();
                                    } else if (isCurrentlyEditingFavorite) {
                                        handleEditFavoriteSave();
                                    }
                                }
                            }}
                            className="flex-grow p-1 border border-indigo-300 rounded-md text-sm break-all"
                            autoFocus
                        />
                    ) : (
                        <a
                            href={type === 'email' ? `mailto:${displayLink}` : displayLink}
                            target={type === 'email' ? '_self' : '_blank'}
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 underline text-sm break-all flex-grow"
                            onClick={() => {
                                if (type === 'email') handleMailtoClick();
                            }}
                        >
                            {displayLink}
                        </a>
                    )}
                    <button
                        onClick={() => copyToClipboard(displayLink, type)}
                        className="p-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition duration-150 ease-in-out"
                        title="Copy"
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            if (isFavorite) {
                                handleEditFavoriteStart(uniqueId as string, displayLink);
                            } else {
                                handleEditGeneratedStart(uniqueId as string, displayLink);
                            }
                        }}
                        className="p-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition duration-150 ease-in-out"
                        title="Edit"
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </button>
                </div>
            ) : (
                <p className="text-sm text-gray-500">Enter username to generate link.</p>
            )}
        </div>
    );
};

// --- Main Component ---
const NameCheckerApp: FC = () => {
    const [username, setUsername] = useState('');
    const [copySuccessMessage, setCopySuccessMessage] = useState('');
    const [favoriteLinks, setFavoriteLinks] = useState<FavoriteLink[]>([]);
    const [editingGeneratedLink, setEditingGeneratedLink] = useState<{ id: string; value: string } | null>(null);
    const [editingFavoriteLink, setEditingFavoriteLink] = useState<{ id: string; value: string } | null>(null);
    const [generatedLinkOverrides, setGeneratedLinkOverrides] = useState<Record<string, string>>({});
    const favoritesRef = useRef<HTMLDivElement>(null);

    const socialPlatforms = [
        { name: 'Facebook', prefix: 'https://www.facebook.com/' },
        { name: 'YouTube', prefix: 'https://www.youtube.com/@' },
        { name: 'LinkedIn', prefix: 'https://www.linkedin.com/in/' },
        { name: 'Instagram', prefix: 'https://www.instagram.com/' },
        { name: 'Pinterest', prefix: 'https://www.pinterest.com/' },
        { name: 'X (Twitter)', prefix: 'https://x.com/' },
        { name: 'TikTok', prefix: 'https://www.tiktok.com/@' },
        { name: 'GitHub', prefix: 'https://github.com/' },
    ];

    const domainExtensions = ['.com', '.net', '.org', '.io', '.dev', '.app', '.xyz', '.info'];
    const emailServices = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];

    const favoritedLinkSet = useMemo(
        () => new Set(favoriteLinks.map(fav => fav.link)),
        [favoriteLinks]
    );

    const generateLink = (prefix: string, user: string) =>
        user.trim() ? `${prefix}${user.trim()}` : '';

    const copyToClipboard = async (text: string, type: string = 'link') => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccessMessage(`Copied ${type}!`);
        } catch {
            setCopySuccessMessage('Failed to copy.');
        }
        setTimeout(() => setCopySuccessMessage(''), 2000);
    };

    const handleMailtoClick = () => {
        setCopySuccessMessage('Opening default email client...');
        setTimeout(() => setCopySuccessMessage(''), 3000);
    };

    const addFavorite = (link: string, type: string, name: string) => {
        const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        setFavoriteLinks(prev => [...prev, { id: newId, link, type, name }]);
        setCopySuccessMessage('Added to favorites!');
        setTimeout(() => setCopySuccessMessage(''), 2000);
    };

    const removeFavorite = (id: string) => {
        setFavoriteLinks(prev => prev.filter(fav => fav.id !== id));
        setCopySuccessMessage('Removed from favorites!');
        setTimeout(() => setCopySuccessMessage(''), 2000);
    };

    const toggleFavorite = (link: string, type: string, name: string) => {
        const existingFavorite = favoriteLinks.find(fav => fav.link === link);
        if (existingFavorite) {
            removeFavorite(existingFavorite.id);
        } else {
            addFavorite(link, type, name);
        }
    };

    const handleEditGeneratedStart = (id: string, currentValue: string) => {
        setEditingGeneratedLink({ id, value: currentValue });
    };

    const handleEditGeneratedSave = () => {
        if (editingGeneratedLink) {
            setGeneratedLinkOverrides(prev => ({
                ...prev,
                [editingGeneratedLink.id]: editingGeneratedLink.value,
            }));
            setEditingGeneratedLink(null);
            setCopySuccessMessage('Link updated!');
            setTimeout(() => setCopySuccessMessage(''), 2000);
        }
    };

    const handleEditFavoriteStart = (id: string, currentValue: string) => {
        setEditingFavoriteLink({ id, value: currentValue });
    };

    const handleEditFavoriteSave = () => {
        if (editingFavoriteLink) {
            setFavoriteLinks(prev =>
                prev.map(fav =>
                    fav.id === editingFavoriteLink.id ? { ...fav, link: editingFavoriteLink.value } : fav
                )
            );
            setEditingFavoriteLink(null);
            setCopySuccessMessage('Favorite link updated!');
            setTimeout(() => setCopySuccessMessage(''), 2000);
        }
    };

    const handleResetSpecificGeneratedEdit = (id: string) => {
        setGeneratedLinkOverrides(prev => {
            const newOverrides = { ...prev };
            delete newOverrides[id];
            return newOverrides;
        });
        setCopySuccessMessage('Link reset to default!');
        setTimeout(() => setCopySuccessMessage(''), 2000);
    };

    const scrollToFavorites = () => {
        favoritesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                    <h1 className="text-3xl font-extrabold text-gray-800 text-center sm:text-left">
                        Name Checker
                    </h1>
                    {favoriteLinks.length > 0 && (
                        <button
                            onClick={scrollToFavorites}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center space-x-2 w-full sm:w-auto"
                            title="View your saved links"
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span>Saved Links ({favoriteLinks.length})</span>
                        </button>
                    )}
                </div>
                <p className="text-center text-gray-600 mb-8 text-sm">
                    Enter a username to generate potential links for social media, domains, and email services.
                    Click on a link to open it in a new tab, or use the copy button to save it.
                    Use the edit button to modify a generated link, and the star button to add/remove it from your favorites.
                </p>
                {/* Username Input */}
                <div className="mb-8 relative">
                    <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
                        Enter Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 ease-in-out shadow-sm text-lg"
                        placeholder="e.g., johndoe"
                        value={username}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value.replace(/\s/g, ''))}
                        autoComplete="off"
                    />
                    {username && (
                        <button
                            onClick={() => setUsername('')}
                            className="absolute right-3 top-10 h-7 w-7 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 transition"
                            title="Clear username"
                            tabIndex={0}
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-gray-700">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>
                {/* Social Media Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Social Media Links</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {socialPlatforms.map(platform => {
                            const generatedLink = generateLink(platform.prefix, username);
                            return (
                                <LinkItem
                                    key={platform.name}
                                    name={platform.name}
                                    link={generatedLink}
                                    type="social"
                                    isCurrentlyFavorited={favoritedLinkSet.has(generatedLink)}
                                    username={username}
                                    generatedLinkOverrides={generatedLinkOverrides}
                                    setEditingGeneratedLink={setEditingGeneratedLink}
                                    setEditingFavoriteLink={setEditingFavoriteLink}
                                    editingGeneratedLink={editingGeneratedLink}
                                    editingFavoriteLink={editingFavoriteLink}
                                    handleEditGeneratedSave={handleEditGeneratedSave}
                                    handleEditFavoriteSave={handleEditFavoriteSave}
                                    handleResetSpecificGeneratedEdit={handleResetSpecificGeneratedEdit}
                                    toggleFavorite={toggleFavorite}
                                    copyToClipboard={copyToClipboard}
                                    handleMailtoClick={handleMailtoClick}
                                    handleEditGeneratedStart={handleEditGeneratedStart}
                                    handleEditFavoriteStart={handleEditFavoriteStart}
                                />
                            );
                        })}
                    </div>
                </div>
                {/* Domain Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Domain Links</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {domainExtensions.map(ext => {
                            const fullLink = username.trim() ? `https://${username.trim()}${ext}` : '';
                            return (
                                <LinkItem
                                    key={ext}
                                    name={ext}
                                    link={fullLink}
                                    type="domain"
                                    isCurrentlyFavorited={favoritedLinkSet.has(fullLink)}
                                    username={username}
                                    generatedLinkOverrides={generatedLinkOverrides}
                                    setEditingGeneratedLink={setEditingGeneratedLink}
                                    setEditingFavoriteLink={setEditingFavoriteLink}
                                    editingGeneratedLink={editingGeneratedLink}
                                    editingFavoriteLink={editingFavoriteLink}
                                    handleEditGeneratedSave={handleEditGeneratedSave}
                                    handleEditFavoriteSave={handleEditFavoriteSave}
                                    handleResetSpecificGeneratedEdit={handleResetSpecificGeneratedEdit}
                                    toggleFavorite={toggleFavorite}
                                    copyToClipboard={copyToClipboard}
                                    handleMailtoClick={handleMailtoClick}
                                    handleEditGeneratedStart={handleEditGeneratedStart}
                                    handleEditFavoriteStart={handleEditFavoriteStart}
                                />
                            );
                        })}
                    </div>
                </div>
                {/* Email Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Email Addresses</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {emailServices.map(service => {
                            const email = username.trim() ? `${username.trim()}@${service}` : '';
                            return (
                                <LinkItem
                                    key={service}
                                    name={`@${service}`}
                                    link={email}
                                    type="email"
                                    isCurrentlyFavorited={favoritedLinkSet.has(email)}
                                    username={username}
                                    generatedLinkOverrides={generatedLinkOverrides}
                                    setEditingGeneratedLink={setEditingGeneratedLink}
                                    setEditingFavoriteLink={setEditingFavoriteLink}
                                    editingGeneratedLink={editingGeneratedLink}
                                    editingFavoriteLink={editingFavoriteLink}
                                    handleEditGeneratedSave={handleEditGeneratedSave}
                                    handleEditFavoriteSave={handleEditFavoriteSave}
                                    handleResetSpecificGeneratedEdit={handleResetSpecificGeneratedEdit}
                                    toggleFavorite={toggleFavorite}
                                    copyToClipboard={copyToClipboard}
                                    handleMailtoClick={handleMailtoClick}
                                    handleEditGeneratedStart={handleEditGeneratedStart}
                                    handleEditFavoriteStart={handleEditFavoriteStart}
                                />
                            );
                        })}
                    </div>
                </div>
                {/* My Favorites Section */}
                {favoriteLinks.length > 0 && (
                    <div className="mb-8" ref={favoritesRef}>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">My Favorites</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {favoriteLinks.map(fav => (
                                <LinkItem
                                    key={fav.id}
                                    name={fav.name}
                                    link={fav.link}
                                    type={fav.type}
                                    isFavorite={true}
                                    favoriteId={fav.id}
                                    onRemoveFavorite={removeFavorite}
                                    isCurrentlyFavorited={true}
                                    username={username}
                                    generatedLinkOverrides={generatedLinkOverrides}
                                    setEditingGeneratedLink={setEditingGeneratedLink}
                                    setEditingFavoriteLink={setEditingFavoriteLink}
                                    editingGeneratedLink={editingGeneratedLink}
                                    editingFavoriteLink={editingFavoriteLink}
                                    handleEditGeneratedSave={handleEditGeneratedSave}
                                    handleEditFavoriteSave={handleEditFavoriteSave}
                                    handleResetSpecificGeneratedEdit={handleResetSpecificGeneratedEdit}
                                    toggleFavorite={toggleFavorite}
                                    copyToClipboard={copyToClipboard}
                                    handleMailtoClick={handleMailtoClick}
                                    handleEditGeneratedStart={handleEditGeneratedStart}
                                    handleEditFavoriteStart={handleEditFavoriteStart}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {/* Temporary message display */}
                {copySuccessMessage && (
                    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
                        {copySuccessMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NameCheckerApp;
