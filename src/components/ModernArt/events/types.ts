export interface ModernArtEvent {
  type: 'start_game' | 'update_name' | 'step' | 'start_auction' | 'submit_bid';
  params: any;
}

interface Card {
  color: string;
  auctionType: string;
}

export enum AuctionType {
  OPEN = 'OPEN',
  HIDDEN = 'HIDDEN',
  ONE_OFFER = 'ONE_OFFER',
  FIXED = 'FIXED',
  DOUBLE = 'DOUBLE',
}

export interface Painting {
  painter: string;
  id: number;
}
export interface Auction {
  auctionType: AuctionType;
  auctioneer: string;
  painting: Painting;
  secondPainting?: Painting; // DOUBLE
  fixedPrice?: number; // FIXED
  highestBid?: number | null; // ONE_OFFER, HIDDEN, OPEN
  highestBidder?: string | null; // ONE_OFFER, HIDDEN, OPEN
  latestBidder?: number | null; // ONE_OFFER, FIXED
}
export interface ModernArtState {
  started: boolean;
  deck: Card[];
  users: {
    [id: string]: {
      id: string;
      name: string;
      icon: string;
      cards: Card[];
    };
  };
  roundIndex: number;
  roundStarted: boolean;
  currentAuction: Auction;
}

export const initialState: ModernArtState = {
  started: false,
  users: {},
  deck: [],
  roundIndex: 0,
  roundStarted: false,
  currentAuction: {
    auctionType: AuctionType.OPEN,
    auctioneer: 'cat',
    painting: {
      painter: 'sigrid',
      id: 1,
    },
    highestBid: null,
    highestBidder: null,
  },
};
