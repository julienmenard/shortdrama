export interface VideoData {
  title: string;
  collection_title: string;
  description: string;
  content_id: number;
  duration: number;
  product_year: number;
  assets: {
    cover: Array<{
      url: string;
      ratio: string;
      ratio_tech_label: string;
    }>;
  };
  deliveries: {
    mainDelivery: {
      url_without_token: string;
      duration: number;
      audio: string[];
      subtitle: string[];
      resolution: string;
    };
  };
}

export interface VideoResponse {
  code: number;
  error: number;
  data: {
    total_items: number;
    current_result: number;
    nb_page_max: number;
    items_per_page: number;
    page: number;
    data: VideoData[];
  };
}

export interface KlientoUser {
  user_id: string;
  msisdn: string | null;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  nickname: string | null;
  country: string;
  subscribed: boolean;
  total_credit: number;
  offer: KlientoOffer[];
}

export interface KlientoOffer {
  account_offer_id: number;
  bizoffer_id: string;
  billing_type: string;
  status: string;
  ins_date: string;
  upd_date: string;
  expire_date: string;
  product_id: string;
  atom_product_id: string;
  client_offer_infos: Record<string, any>;
}