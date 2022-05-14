import { useQuery } from 'react-query';
import useApi from '../../hooks/useApi';

const HomeContainer = () => {
    const apiClient = useApi();

    const { data: user, refetch: refetchUser } = useQuery(
        'getCurrentUser',
        async () => await apiClient.getCurrentUser(),
        {
            refetchOnWindowFocus: false,
        }
    );

    return {
        refetchUser,
        user,
    };
};

export default HomeContainer;
