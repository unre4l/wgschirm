
<script>
export default {
  data() {
    return {
      data: null,
    };
  },
  mounted() {
    this.subscribe('Example', (data) => {
      console.log(data);
    });
  },
  render() {
    return null;
  },
};
</script>
