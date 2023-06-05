import { Box } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { useCurrentCountry } from 'utilities/market';
import { PLATFORM_SPACE_TYPES_QUERY } from '../../queries/query';
import { SpaceTypesQuery, SpaceTypesQueryVariables, SpaceTypesQuery_space_types_edges } from '../../queries/__generated__/SpaceTypesQuery';

interface IProps {
  children(d: SpaceTypesQuery_space_types_edges[]): JSX.Element;
}

const compareFunc = (
  a:SpaceTypesQuery_space_types_edges,
  b:SpaceTypesQuery_space_types_edges,
) => (a.size_from + a.size_to) - (b.size_from + b.size_to);

const SpaceTypesContainer: React.FunctionComponent<IProps> = ({ children }) => {
  const query = useQuery<SpaceTypesQuery, SpaceTypesQueryVariables>(PLATFORM_SPACE_TYPES_QUERY, {
    variables: {
      country: useCurrentCountry().name,
    },
  });
  let types = query?.data?.space_types?.edges || [];
  if (types.length) types = [...types].sort(compareFunc);

  return (
    <Box>
      {children(types)}
    </Box>
  );
};

export default SpaceTypesContainer;
