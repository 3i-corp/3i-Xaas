"use client";

type Props = {
  wsRef: React.RefObject<
    WebSocket | null
  >;
};

export default function AdminPanel({
  wsRef,
}: Props) {

  return (

    <div
      style={{
        marginTop: 24,
      }}
    >

      <h2>
        Admin
      </h2>

      <button
        onClick={() => {

          wsRef.current?.send(
            JSON.stringify({
              type:
                "admin.update",

              config: {
                payoutRate: 90,
              },
            })
          );

        }}
      >
        Set Payout 90
      </button>

    </div>

  );

}