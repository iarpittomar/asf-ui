import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { isEqual } from 'lodash';

// import API from './api';
// import Filter from './filter';

const TimeFilterIcon = styled.div`
  position: fixed;
  bottom: 5px;
  left: calc(50% - 8px);
  opacity: ${({ active }) => (active ? 1 : 0.3)};
`;

const withConfig = (Component) => {
  function WithConfig({
    componentKey,
    editmode,
    filter,
    timeFilter,
    data,
    ...props
  }) {
    const [config, setConfig] = useState({
      properties: props.properties,
      fields: props.fields,
    });
    const [combinedFilter, setCombinedFilter] = useState(null);
    const [compFilter, setCompFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ready, setReady] = useState(false);
    const loadingTimer = useRef(null);
    const filterRef = useRef(null);
    const componentKeyRef = useRef(null);

    const configPersistence = async ({ action, data: args }) => {
      if (!config?.properties?.persistence) {
        return false;
      }

      if (action === 'update' && config?.properties?.componentKey) {
        const result = await API.updateCompConfig({
          componentKey: config.properties.componentKey,
          ...args,
        });
        return result;
      }

      if (action === 'delete' && config?.properties?.componentKey) {
        await API.resetCompConfig(config.properties.componentKey);
        const result = await API.loadCompConfig(config.properties.componentKey);
        if (result) {
          setConfig({ properties: result.properties, fields: result.fields });
          setCompFilter(result.filter);
        }
      }
      return false;
    };

    const fetchConfig = async () => {
      const result = await API.loadCompConfig(componentKey);
      if (result) {
        const resConfig = result?.data || result;
        const { properties, fields } = resConfig;
        setConfig({ properties, fields });
        if (resConfig.filter) {
          setCompFilter(resConfig.filter);
        }
      }
      setLoading(false);
      setReady(true);
    };

    useEffect(() => {
      if (!editmode && componentKey) {
        if (
          componentKeyRef?.current &&
          componentKeyRef.current === componentKey
        ) {
          return;
        }
        componentKeyRef.current = componentKey;
        clearTimeout(loadingTimer.current);
        if (!loading) {
          setLoading(true);
        }
        loadingTimer.current = setTimeout(fetchConfig, 100);
      }
    }, [componentKey, editmode]);

    useEffect(() => {
      const newFilter = Filter.combineFilters(compFilter, filter);
      setCombinedFilter(newFilter);
    }, [filter, setCombinedFilter]);

    useEffect(() => {
      const newFilter = Filter.combineFilters(compFilter, filter);
      if (!isEqual(filterRef.current, newFilter)) {
        filterRef.current = newFilter;
        setCombinedFilter(newFilter);
      }
    }, [compFilter, setCombinedFilter]);

    useEffect(() => () => clearTimeout(loadingTimer.current), []);

    return (
      <div
        style={{ position: 'relative', width: 'inherit', height: 'inherit' }}
        className="conf-comp"
      >
        {(config?.properties || ready) && (
          <Component
            {...{
              ...props,
              editmode,
              componentKey,
              ...config,
              filter: combinedFilter,
              timeFilter,
              data,
              configPersistence,
            }}
            style={{ opacity: loading ? 0 : 1 }}
          />
        )}
        {config?.properties?.enableTimeFilter && (
          <TimeFilterIcon
            title={timeFilter?.operator ? 'Time Filter active' : 'Time Filter'}
            className="icon-filter1"
            active={timeFilter?.operator}
          />
        )}
      </div>
    );
  }

  WithConfig.propTypes = {
    componentKey: string,
    editmode: bool,
    properties: shape({}),
    fields: arrayOf(shape({})),
    filter: shape({}),
    timeFilter: shape({}),
    data: shape({}),
  };

  WithConfig.defaultProps = {
    componentKey: '',
    editmode: false,
    properties: null,
    fields: null,
    filter: null,
    timeFilter: null,
    data: null,
  };

  return WithConfig;
};

export default withConfig;
