import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
  ) {
    try {
  
      if (!params.storeId) {
        return new NextResponse("Store id required", { status: 400 });
      }
      if (!params.categoryId) {
        return new NextResponse("Category id required", { status: 400 });
      }
  
      const category = await prismadb.category.findUnique({
        where: {
          id: params.categoryId,
          
        },
      });
  
      return NextResponse.json(category);
    } catch (error) {
      console.log("CATEGORY GET", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Label required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Image URL required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id required", { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse("CategoryId is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("CATEGORY PATCH", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id required", { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse("Category id required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: params.storeId,
          userId,
        },
      });
  
      if (!storeByUserId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
        
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("CATEGORY DELETE", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}