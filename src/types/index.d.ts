declare namespace App {
  interface Entry {
    id: string;
    filmpolitietId: string;
    name: string;
    url: URL;
    rating: number;
    coverArt: string;
    reviewDate: string;
    expand: {
      type: Type;
    };
  }

  interface Type {
    id: string;
    name: string;
  }

  interface Author {
    id: string;
    name: string;
    url: URL;
    email: string;
  }
}
