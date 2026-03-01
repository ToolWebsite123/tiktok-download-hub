import React from 'react';

const RecentDownloads = () => {
    const downloads = [
        {
            id: 1,
            thumbnail: 'url_to_thumbnail_1',
            creator: 'Creator 1',
            views: 120,
            likes: 35,
        },
        {
            id: 2,
            thumbnail: 'url_to_thumbnail_2',
            creator: 'Creator 2',
            views: 80,
            likes: 22,
        },
        {
            id: 3,
            thumbnail: 'url_to_thumbnail_3',
            creator: 'Creator 3',
            views: 200,
            likes: 45,
        },
    ];

    return (
        <div>
            <h2>Recent Downloads</h2>
            <ul>
                {downloads.map(download => (
                    <li key={download.id}>
                        <img src={download.thumbnail} alt={`Thumbnail for ${download.creator}`} />
                        <div>
                            <h3>{download.creator}</h3>
                            <p>{download.views} views | {download.likes} likes</p>
                            <button>Download</button>
                            <button>View</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentDownloads;