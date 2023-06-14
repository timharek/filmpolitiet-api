declare namespace App {
  interface Entry {
    id: string;
    filmpolitietId: string;
    name: string;
    url: URL;
    rating: number;
    expand: {
      type: Type;
    };
  }

  interface Type {
    id: string;
    name: string;
  }
}
