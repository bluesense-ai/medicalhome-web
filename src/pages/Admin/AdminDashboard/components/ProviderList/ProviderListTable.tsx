import React, { useState,useMemo } from 'react';
import { Provider, SortKey, SortDirection, Column } from './types';

type ProviderStatus = 'Vacation' | 'Out of office' | 'On call' | 'Available' | 'Unknown status';

const ProviderListTable: React.FC<{ providers: Provider[] }> = ({
  providers
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>(null);

  const getStatusColor = (status: Provider['provider_status']): string => {
    const colors: Record<ProviderStatus, string> = {
      Vacation: "bg-blue-500",
      "Out of office": "bg-yellow-500",
      "On call": "bg-red-500",
      Available: "bg-green-500",
      "Unknown status": "bg-gray-500",
    };

    return (status in colors) ? colors[status as ProviderStatus] : 'bg-gray-500';
  };

  const sortData = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

  };
  const sortedProviders = useMemo(() => {
    if (!sortConfig) return providers;

    return [...providers].sort((a, b) => {
      if (sortConfig.key === 'name') {
        const fullNameA = `${a.first_name}`;
        const fullNameB = `${b.first_name}`;
        return sortConfig.direction === 'asc'
          ? fullNameA.localeCompare(fullNameB)
          : fullNameB.localeCompare(fullNameA);
      }

      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [providers, sortConfig]);

  const getSortIcon = (key: SortKey) => {
    
    if (!sortConfig || sortConfig.key !== key) {
      return '/Icons/ArrowRight.svg';
    }
    return sortConfig.direction === 'asc'
      ? '/Icons/ArrowRight.svg'
      : '/Icons/ArrowDownIcon.svg';
  };

  const columns: Column[] = [
    { label: "Avatar", key: "picture" },
    { label: "First Name", key: "name" },
    { label: "Last Name", key: "last_name" },
    { label: "Status", key: "provider_status" },
    { label: "Patients", key: "patient_count" },
    { label: "Job Title", key: "roles" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-lg">
        <thead>
          <tr className="bg-[#005063] text-white font-semibold">
            {columns.map(({ label, key }) => (
              <th
                key={key}
                className="px-4 py-2 cursor-pointer"
                onClick={() => key !== "picture" && sortData(key as SortKey)}
              >
                <div className="flex items-center justify-center">
                  <span>{label}</span>
                  {key !== "picture" && (
                    <img
                      src={getSortIcon(key as SortKey)}
                      alt="sort icon"
                      className="w-8 h-8 ml-1"
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedProviders.map((provider:any) => (
            <tr
              key={provider.id}
              className="bg-blue-50 border-b border-opacity-40 border-[#3499D6]"
            >
              <td className="px-4 py-2">
                <div className="flex justify-center">
                  <img
                    src={`${import.meta.env.VITE_CDN_URL}/${import.meta.env.VITE_BUCKET_NAME}/${provider.picture}`}
                    alt={`${provider.first_name} ${provider.last_name}`}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
              </td>
              <td className="text-center px-4 py-2">{`${provider.first_name}`}</td>
              <td className="text-center px-4 py-2">{provider.last_name}</td>
              <td className="text-left px-4 py-2">
                <div className="flex items-center 2xl:ml-[100px]">
                  <span
                    className={`inline-block w-3 h-3 sm:w-5 sm:h-5 rounded-full mr-2 ${getStatusColor(
                      provider.provider_status
                    )}`}
                  ></span>
                  <span>{provider.provider_status}</span>
                </div>
              </td>
              <td className="text-center px-4 py-2">{provider.patient_count}</td>
              <td className="text-left px-4 py-2">{provider.roles.map((role:any) => role.name).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProviderListTable;