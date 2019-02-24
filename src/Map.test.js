import { h } from 'preact';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import leaflet from 'leaflet';
import TileLayer from './TileLayer';
import Map from './Map';

describe('Map', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should render a leaflet map', () => {
    const wrapper = mount(<Map />);

    expect(!!wrapper.getDOMNode()._leaflet_id).to.be.true;
  });

  it('should map accurate props to map options', () => {
    const mapOptions = {
      attributionControl: true,
      bounceAtZoomLimits: true,
      boundsOptions: { paddingTopLeft: [0, 1] },
      crs: [],
      easeLinearity: false,
      fadeAnimation: false,
      inertia: false,
      inertiaDeceleration: 300,
      inertiaMaxSpeed: Infinity,
      keyboard: true,
      keyboardPanDelta: 10,
      layers: [],
      markerZoomAnimation: true,
      maxBounds: 12,
      maxBoundsViscosity: 0.1,
      maxZoom: 3,
      minZoom: 2,
      preferCanvas: true,
      renderer: false,
      scrollWheelZoom: false,
      tap: true,
      tapTolerance: 10,
      touchZoom: false,
      transform3DLimit: true,
      wheelDebounceTime: 200,
      wheelPxPerZoomLevel: 1,
      worldCopyJump: true,
      zoomAnimation: false,
      zoomControl: false,
    };
    sandbox.stub(leaflet, 'Map').returns({ setView: () => null });
    const wrapper = mount(<Map {...mapOptions} nonMapOption />);

    expect(leaflet.Map).to.have.been.calledWithExactly(sinon.match.any, sinon.match(mapOptions));
  });

  it('should call setBounds if bounds are given', () => {
    const bounds = leaflet.latLngBounds(
      leaflet.latLng(59.362774, 18.116663116961718),
      leaflet.latLng(59.34308605870865, 18.081772942096),
    );
    sandbox.stub(leaflet.Map.prototype, 'fitBounds');
    mount(<Map bounds={bounds} center={[59.35, 18.10]} />);

    expect(leaflet.Map.prototype.fitBounds).to.have.been.calledWithExactly(bounds);
  });

  it('should update bounds when changing bounds prop', () => {
    const wrapper = mount(<Map center={[59.35, 18.10]} />);
    const bounds = leaflet.latLngBounds(
      leaflet.latLng(59.362774, 18.116663116961718),
      leaflet.latLng(59.34308605870865, 18.081772942096),
    );

    sandbox.stub(leaflet.Map.prototype, 'fitBounds');
    wrapper.setProps({ bounds });
    expect(leaflet.Map.prototype.fitBounds).to.have.been.calledWithExactly(bounds);
  });

  it('should update the center position upon changing center prop', () => {
    const wrapper = mount(<Map />);

    const center = { lat: 56.38, lng: 17.98 };
    wrapper.setProps({ center });

    expect(wrapper.state('map').getCenter()).to.deep.include(center);
  });

  it('should destroy the map upon unmount', () => {
    sandbox.spy(leaflet.Map.prototype, 'remove');
    const wrapper = mount(<Map />);
    wrapper.unmount();

    expect(leaflet.Map.prototype.remove).to.have.been.called;
  });

  it('should pass arbitrary props to DOM node', () => {
    const wrapper = mount(<Map arbitrary />);

    expect(wrapper.children().props().arbitrary).to.equal(true);
  });

  it('should add leafletMap prop TileLayer children to make it attach to map', () => {
    const spy = sandbox.spy(leaflet, 'TileLayer');
    const wrapper = mount(<Map><TileLayer url="url" /></Map>);

    expect(wrapper.html()).to.contain('leaflet-tile-pane');
  });
});
