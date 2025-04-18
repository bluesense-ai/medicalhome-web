import axiosInstance from "../../../../../../axios/axiosInstance";

export const syncServices = async (
    msServices: any[],
    providerId: string
  ): Promise<void> => {
    try {

      const localServiceResponse = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/providers/${providerId}/services`
      );
      const localServices = localServiceResponse.data;

      // Step 1: Create lookup maps for local services and Microsoft services
      const localServiceMap = new Map<string, any>(
        localServices.map((service:any) => [service.ms_id, service])
      );
      const msServiceMap = new Map<string, any>(
        msServices.map((service) => [service.id, service])
      );

      for (const msService of msServices) {
        const localService = localServiceMap.get(msService.id);

        if (localService) {
          // Check for any differences and update the local service if needed
          if (
            localService.name !== msService.displayName ||
            localService.default_duration !== msService.defaultDuration ||
            localService.price !== msService.defaultPrice ||
            localService.description !== msService.description ||
            localService.pre_buffer !== msService.preBuffer ||
            localService.post_buffer !== msService.postBuffer
          ) {
            // Update the local service
            await axiosInstance.put(
              `${import.meta.env.VITE_BACKEND_URL}/services/${localService.id}`,
              {
                name: msService.displayName,
                default_duration: msService.defaultDuration,
                price: msService.defaultPrice,
                description: msService.description,
                pre_buffer: msService.preBuffer,
                post_buffer: msService.postBuffer,
              }
            );
          } else {
            
          }
        } else {
          // Add the new service
          await axiosInstance.post(
            `${import.meta.env.VITE_BACKEND_URL}/services/with-provider`,
            {
              ms_id: msService.id,
              name: msService.displayName,
              default_duration: msService.defaultDuration,
              price: msService.defaultPrice,
              description: msService.description,
              pre_buffer: msService.preBuffer,
              post_buffer: msService.postBuffer,
              provider_id: providerId,
            }
          );
        }
      }

      // Step 3: Delete services that exist locally but not in Microsoft
      for (const localService of localServices) {
        if (!msServiceMap.has(localService.ms_id)) {
          await axiosInstance.delete(
            `${import.meta.env.VITE_BACKEND_URL}/services/${localService.id}`
          );
          
        }
      }

    } catch (error: any) {
      console.error("Error synchronizing services:", error);
    }
  };
