
<script>
export default {
    data () {
        return {
            data: null,
        }
    },
    render() {
      return null;
    },
    mounted () {
      this.subscribe('Example', (data) => {
        console.log(data);
      });
    },
}
</script>
