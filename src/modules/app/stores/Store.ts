import dayjs from 'dayjs';
import {
  makeObservable, observable, action, runInAction,
} from 'mobx';
import { IElasticSite } from 'pages/api/es';
import { ICountries } from 'utilities/convertSitesToGraphqlFormat';
import elasticSearch, { IParams } from 'utilities/elasticSearch';
import getAvailableStock from 'utilities/getAvailableStock';
import countries from '../../../../public/locations.json';

export const STORE_KEY = 'esStore';

export class Store {
  constructor() {
    makeObservable(this);
  }

  @observable moveInDate = dayjs().add(1, 'day').format('YYYY-MM-DD');

  @observable sites: IElasticSite[] = [];

  @observable countryId: number;

  @observable locations: ICountries[] = [];

  @action
  setCountryId = (val: number) => {
    this.countryId = val;
  };

  @action
  populateData = async (countryId: number) => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const moveInDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
      const params: IParams = {
        query: {
          bool: {
            must: [
              {
                match: {
                  status: 'ACTIVE',
                },
              },
              {
                match: {
                  'address.country_id': countryId,
                },
              },
              {
                nested: {
                  path: 'spaces',
                  query: {
                    bool: {
                      must: [
                        {
                          match: {
                            'spaces.status': 'ACTIVE',
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
        fields: [],
        // eslint-disable-next-line
                _source: ["id", "address.city_id", "address.district_id"],
        from: 0,
        size: 10000,
      };
      const res = await elasticSearch.search(params);
      // eslint-disable-next-line
            const siteIds = res.data.hits.hits.map((hit) => hit._source?.id);

      const stock = await getAvailableStock({
        site_ids: siteIds,
        move_in_date: moveInDate,
      });

      const sites = res.data.hits.hits.filter((site) => {
        const availableSites = stock.data.sites.filter(
          // eslint-disable-next-line
                    (s) => s.id === site._source?.id
        );
        return !!availableSites.length;
      });

      const locations = countries.filter((country) => country.id === countryId);

      locations[0].cities = locations[0].cities.filter((city) => {
        for (let i = 0; i < sites.length; i += 1) {
          const siteCity = sites[i];
          // eslint-disable-next-line
                    if (siteCity._source.address.city_id === city.id) {
            city.districts = city.districts.filter((district) => {
              for (let j = 0; j < sites.length; j += 1) {
                const siteDistrict = sites[j];
                // eslint-disable-next-line
                                if (siteDistrict._source.address.district_id === district.id) {
                  return true;
                }
              }
              return false;
            });
            return true;
          }
        }
        return false;
      });
      runInAction(() => {
        this.locations = locations;
      });
    } catch (error) {
      console.log(error);
    }
  };
}
