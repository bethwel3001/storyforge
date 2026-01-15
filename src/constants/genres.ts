type GenreParts = {
    tone: string[];
    core: string[];
    modifier: string[];
    theme: string[];
};

const GENRE_PARTS: GenreParts = {
    tone: [
        "Dark",
        "Hopeful",
        "Bleak",
        "Whimsical",
        "Gritty",
        "Satirical",
        "Mythic",
        "Surreal"
    ],
    core: [
        "Action",
        "Adventure",
        "Comedy",
        "Drama",
        "Fantasy",
        "Science Fiction",
        "Horror",
        "Mystery",
        "Thriller",
        "Romance",
        "Crime",
        "Historical",
        "Western",
        "War",
        "Myth",
        "Slice of Life",
        "Speculative",
        "Experimental"
    ],
    modifier: [
        "Noir",
        "Epic",
        "Psychological",
        "Cosmic",
        "Urban",
        "Post-Apocalyptic",
        "Mythpunk",
        "Cyber"
    ],
    theme: [
        "Redemption",
        "Survival",
        "Identity",
        "Rebellion",
        "Love",
        "Decay",
        "Transcendence",
        "Power"
    ]
};
export default GENRE_PARTS